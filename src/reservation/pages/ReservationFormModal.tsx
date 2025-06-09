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
  Divider,
  Button,
  Row,
  Col,
  Card,
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

        const data = await fetchRooms(checkIn, checkOut, initialData.cantPeople);
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
            assignedRoomNumber: r.assignedRoomNumber || null,
          };
        });

        form.setFieldsValue({
          ...initialData,
          initDate: dayjs(initialData.initDate),
          finishDate: dayjs(initialData.finishDate),
          rooms: formattedRooms,
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
    const assignedNumbers = values.rooms
      .map((r: any) => r.assignedRoomNumber?.trim())
      .filter((num: string | undefined): num is string => !!num);

    const duplicates = assignedNumbers.filter(
      (num: string, i: number, arr: string[]) => arr.indexOf(num) !== i
    );

    if (duplicates.length > 0) {
      message.error("Hay números de habitación duplicados. Verifica antes de guardar.");
      return;
    }

    const payload = {
      ...values,
      initDate: values.initDate.format("YYYY-MM-DD"),
      finishDate: values.finishDate.format("YYYY-MM-DD"),
      rooms: values.rooms.map((r: any) => ({
        roomId: r.roomId.value ?? r.roomId,
        quantity: r.quantity,
        assignedRoomNumber: r.assignedRoomNumber || null,
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

      form.resetFields();
      onSubmit();
    } catch {
      message.error("Error al guardar la reserva");
    }
  };

  return (
    <Modal
      open={visible}
      title={<Title level={5}>{initialData ? "Editar reserva" : "Nueva reserva"}</Title>}
      onCancel={onCancel}
      footer={null}
      width={720}
      centered
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        onValuesChange={handleValuesChange}
      >
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item name="initDate" label="Fecha de entrada" rules={[{ required: true }]}>
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="finishDate" label="Fecha de salida" rules={[{ required: true }]}>
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="cantPeople" label="Personas" rules={[{ required: true }]}>
              <InputNumber min={1} style={{ width: "100%" }} />
            </Form.Item>
          </Col>
        </Row>

        <Form.List name="rooms">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <Row gutter={12} key={key} style={{ marginBottom: 12 }}>
                  <Col span={8}>
                    <Form.Item
                      {...restField}
                      name={[name, "roomId"]}
                      rules={[{ required: true, message: "Selecciona habitación" }]}
                    >
                      <Select placeholder="Habitación" labelInValue optionLabelProp="label">
                        {availableRooms.map((room) => (
                          <Option
                            key={room.roomId}
                            value={room.roomId}
                            label={`${room.name} – $${room.price}`}
                          >
                            {room.name} – ${room.price}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={5}>
                    <Form.Item
                      {...restField}
                      name={[name, "quantity"]}
                      rules={[{ required: true, message: "Cantidad requerida" }]}
                    >
                      <InputNumber min={1} style={{ width: "100%" }} />
                    </Form.Item>
                  </Col>
                  <Col span={7}>
                    <Form.Item {...restField} name={[name, "assignedRoomNumber"]}>
                      <Input placeholder="N° habitación (opcional)" />
                    </Form.Item>
                  </Col>
                  <Col span={4}>
                    <Button danger onClick={() => remove(name)} style={{ marginTop: 2 }}>
                      Eliminar
                    </Button>
                  </Col>
                </Row>
              ))}
              <Form.Item>
                <Button type="dashed" onClick={() => add()} block>
                  Agregar habitación
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>

        {summary.details.length > 0 && (
          <Card size="small" style={{ backgroundColor: "#f6ffed", marginTop: 10 }}>
            <Text strong>Resumen de la reserva ({summary.nights} noche(s)):</Text>
            <ul style={{ paddingLeft: "20px" }}>
              {summary.details.map((detail, i) => (
                <li key={i}>{detail}</li>
              ))}
            </ul>
            <Text>Subtotal: ${summary.subtotal.toFixed(2)}</Text> <br />
            <Text>IVA (13%): ${summary.iva.toFixed(2)}</Text> <br />
            <Text strong>Total: ${summary.total.toFixed(2)}</Text>
          </Card>
        )}

        <Divider />

        <Form.Item name="name" label="Nombre completo" rules={[{ required: true }]}>
          <Input placeholder="Nombre del cliente" />
        </Form.Item>

        <Form.Item
          name="email"
          label="Correo electrónico"
          rules={[{ required: true, type: "email" }]}
        >
          <Input placeholder="correo@ejemplo.com" />
        </Form.Item>

        <Form.Item name="phone" label="Teléfono" rules={[{ required: true }]}>
          <Input maxLength={9} placeholder="00000000" />
        </Form.Item>

        <Form.Item name="payment" label="Total con IVA" rules={[{ required: true }]}>
          <InputNumber disabled style={{ width: "100%" }} prefix="$" />
        </Form.Item>

        <Row justify="end">
          <Button onClick={onCancel} style={{ marginRight: 8 }}>
            Cancelar
          </Button>
          <Button type="primary" htmlType="submit">
            {initialData ? "Actualizar" : "Guardar"}
          </Button>
        </Row>
      </Form>
    </Modal>
  );
};
