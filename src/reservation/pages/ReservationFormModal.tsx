import { FC, useEffect, useState } from "react";
import {
  Modal,
  Form,
  Input,
  DatePicker,
  InputNumber,
  Select,
  Typography,
  message,
  Button,
  Row,
  Col,
  Divider,
} from "antd";
import dayjs from "dayjs";
import {
  SaveReservations,
  UpdateReservation,
  getAvailableRooms,
} from "../services/reservationService";

const { Title, Text } = Typography;
const { Option } = Select;

interface ReservationFormModalProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: () => void;
  initialData?: any;
}

export const ReservationFormModal: FC<ReservationFormModalProps> = ({
  visible,
  onCancel,
  onSubmit,
  initialData,
}) => {
  const [form] = Form.useForm();
  const [availableRooms, setAvailableRooms] = useState<any[]>([]);
  const [summary, setSummary] = useState({
    subtotal: 0,
    iva: 0,
    total: 0,
    details: [] as string[],
    nights: 0,
  });

  const fetchRooms = async (checkIn: string, checkOut: string, guests: number) => {
    try {
      const data = await getAvailableRooms(checkIn, checkOut, guests);
      return data;
    } catch {
      message.error("Error al obtener habitaciones");
      return [];
    }
  };

  useEffect(() => {
    const loadData = async () => {
      if (visible && initialData) {
        const checkIn = dayjs(initialData.initDate).format("YYYY-MM-DD");
        const checkOut = dayjs(initialData.finishDate).format("YYYY-MM-DD");

        let data = await fetchRooms(checkIn, checkOut, initialData.cantPeople);

        for (const r of initialData.rooms || []) {
          if (!data.find((ar) => ar.roomId === r.roomId)) {
            data.push({ roomId: r.roomId, name: "Habitación no disponible", price: 0 });
          }
        }

        setAvailableRooms(data);

        const formattedRooms = initialData.rooms?.map((r: any) => {
          const room = data.find((ar) => ar.roomId === r.roomId);
          return {
            roomId: {
              key: r.roomId,
              value: r.roomId,
              label: room ? `${room.name} – $${room.price}` : `${r.roomId}`,
            },
            quantity: r.quantity,
          };
        });

        form.setFieldsValue({
          ...initialData,
          initDate: dayjs(initialData.initDate),
          finishDate: dayjs(initialData.finishDate),
          rooms: formattedRooms,
          status: initialData.status || "FUTURA",
        });
      }

      if (!visible) {
        form.resetFields();
        setAvailableRooms([]);
        setSummary({ subtotal: 0, iva: 0, total: 0, details: [], nights: 0 });
      }
    };

    loadData();
  }, [visible, initialData]);

  const calculateSummary = () => {
    const values = form.getFieldsValue();
    if (!values.rooms || !values.initDate || !values.finishDate) return;

    const checkIn = new Date(values.initDate);
    const checkOut = new Date(values.finishDate);
    const nights = Math.max(0, (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));

    let subtotal = 0;
    const details: string[] = [];

    for (const r of values.rooms) {
      const roomId = r.roomId?.value ?? r.roomId;
      const room = availableRooms.find((ar) => ar.roomId === roomId);
      if (room && r.quantity > 0) {
        const totalRoom = room.price * r.quantity * nights;
        subtotal += totalRoom;
        details.push(`${room.name} × ${r.quantity} × ${nights} noche(s) = $${totalRoom.toFixed(2)}`);
      }
    }

    const iva = subtotal * 0.13;
    const total = subtotal + iva;

    setSummary({ subtotal, iva, total, details, nights });
    form.setFieldsValue({ payment: parseFloat(total.toFixed(2)) });
  };

  const handleValuesChange = () => {
    const { initDate, finishDate, cantPeople } = form.getFieldsValue();
    if (initDate && finishDate && cantPeople) {
      fetchRooms(initDate.format("YYYY-MM-DD"), finishDate.format("YYYY-MM-DD"), cantPeople)
        .then(setAvailableRooms);
    }
    setTimeout(() => calculateSummary(), 100);
  };

  const handleFinish = async (values: any) => {
    if (values.finishDate.isBefore(values.initDate)) {
      message.error("La fecha de salida no puede ser antes de la de entrada.");
      return;
    }

    const totalCapacity = values.rooms.reduce((sum: number, r: any) => {
      const roomId = r.roomId?.value ?? r.roomId;
      const room = availableRooms.find((ar) => ar.roomId === roomId);
      return room ? sum + room.maxCapacity * r.quantity : sum;
    }, 0);

    if (totalCapacity < values.cantPeople) {
      message.error(`La capacidad total (${totalCapacity}) no alcanza para ${values.cantPeople} persona(s).`);
      return;
    }

    const payload = {
      ...values,
      initDate: values.initDate.format("YYYY-MM-DD"),
      finishDate: values.finishDate.format("YYYY-MM-DD"),
      payment: summary.total,
      status: values.status,
      rooms: values.rooms.map((r: any) => ({
        roomId: r.roomId.value ?? r.roomId,
        quantity: r.quantity,
      })),
    };

    try {
      if (initialData?.reservationId) {
        await UpdateReservation(initialData.reservationId, payload);
        message.success("Reserva actualizada");
      } else {
        await SaveReservations(payload);
        message.success("Reserva creada");
      }

      await fetch(`${import.meta.env.VITE_BASE_URL}/api/availability/update`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });

      form.resetFields();
      onSubmit();
    } catch {
      message.error("Error al guardar la reserva");
    }
  };

  return (
    <Modal
      open={visible}
      title={<Title level={4}>{initialData ? "Editar reserva" : "Nueva reserva"}</Title>}
      onCancel={onCancel}
      footer={null}
      width={700}
      centered
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        onValuesChange={handleValuesChange}
        style={{ maxWidth: 520, margin: "0 auto" }}
      >
        <Form.Item label="Nombre" name="name" rules={[{ required: true }]}>
          <Input size="large" placeholder="Nombre del cliente" />
        </Form.Item>
        <Form.Item label="Teléfono" name="phone" rules={[{ required: true }]}>
          <Input size="large" placeholder="Ej: 7777-0000" />
        </Form.Item>
        <Form.Item label="Correo" name="email" rules={[{ required: true, type: "email" }]}> 
          <Input size="large" placeholder="correo@ejemplo.com" />
        </Form.Item>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Fecha de entrada" name="initDate" rules={[{ required: true }]}> 
              <DatePicker size="large" style={{ width: "100%" }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Fecha de salida" name="finishDate" rules={[{ required: true }]}> 
              <DatePicker size="large" style={{ width: "100%" }} />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item label="Cantidad de personas" name="cantPeople" rules={[{ required: true }]}> 
          <InputNumber size="large" min={1} style={{ width: "100%" }} />
        </Form.Item>

        {initialData && (
          <Form.Item label="Estado" name="status" rules={[{ required: true }]}> 
            <Select size="large">
              <Option value="FUTURA">FUTURA</Option>
              <Option value="ACTIVA">ACTIVA</Option>
              <Option value="FINALIZADA">FINALIZADA</Option>
            </Select>
          </Form.Item>
        )}

        <Divider />

        <Form.List name="rooms">
          {(fields, { add, remove }) => (
            <>
              {fields.map((field, index) => (
                <Row key={field.key} gutter={16} style={{ marginBottom: 8 }}>
                  <Col span={16}>
                    <Form.Item label={`Habitación #${index + 1}`} name={[field.name, "roomId"]} rules={[{ required: true }]}> 
                      <Select
                        showSearch
                        size="large"
                        placeholder="Selecciona habitación"
                        optionFilterProp="label"
                        disabled={availableRooms.length === 0}
                      >
                        {availableRooms.map((room) => (
                          <Option
                            key={room.roomId}
                            value={room.roomId}
                            label={`${room.name} – $${room.price}`}
                            disabled={room.availableQuantity <= 0}
                          >
                            {`${room.name} – $${room.price} (${room.availableQuantity} disponibles)`}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item label="Cantidad" name={[field.name, "quantity"]} rules={[{ required: true }]}> 
                      <InputNumber size="large" min={1} style={{ width: "100%" }} />
                    </Form.Item>
                  </Col>
                  <Col span={2} style={{ display: "flex", alignItems: "center" }}>
                    <Button danger type="link" onClick={() => remove(field.name)}>Eliminar</Button>
                  </Col>
                </Row>
              ))}
              <Form.Item>
                <Button type="dashed" onClick={() => add()} block>
                  + Agregar habitación
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>

        <Divider />

        <div style={{ background: "#fafafa", padding: 16, borderRadius: 8, marginBottom: 24 }}>
          <Title level={5}>Resumen de la reserva</Title>
          <ul>
            {summary.details.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
          <Text strong>Subtotal: ${summary.subtotal.toFixed(2)}</Text> <br />
          <Text strong>IVA (13%): ${summary.iva.toFixed(2)}</Text> <br />
          <Text strong>Total: ${summary.total.toFixed(2)}</Text>
        </div>

        <Row justify="center">
          <Col>
            <Button type="primary" htmlType="submit" size="large">
              {initialData ? "Actualizar reserva" : "Crear reserva"}
            </Button>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};
