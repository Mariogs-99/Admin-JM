import { FC, useEffect, useState } from "react";
import { useWatch } from "antd/es/form/Form";
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
  setLoading?: (loading: boolean) => void;
}

export const ReservationFormModal: FC<ReservationFormModalProps> = ({
  visible,
  onCancel,
  onSubmit,
  initialData,
  setLoading, // ✅ se usará en lugar del modal interno
}) => {
  const [form] = Form.useForm();
  const watchedRooms = useWatch("rooms", form);
  const watchedInit = useWatch("initDate", form);
  const watchedFinish = useWatch("finishDate", form);
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

        for (const r of initialData.rooms || []) {
          if (!data.find((ar) => ar.roomId === r.roomId)) {
            data.push({
              roomId: r.roomId,
              nameEs: r.roomName || "Habitación no disponible",
              price: r.price ?? 0,
              maxCapacity: r.maxCapacity ?? 1,
              availableQuantity: r.quantity ?? 0,
            });
          }
        }

        setAvailableRooms(data);

        const formattedRooms = initialData.rooms?.map((r: any) => ({
          roomId: r.roomId,
          quantity: r.quantity,
        }));

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
      if (!r || r.roomId === undefined) continue;

      const room = availableRooms.find((ar) => ar.roomId === r.roomId);
      const quantity = Number(r.quantity) || 0;

      if (room && quantity > 0) {
        const totalRoom = room.price * quantity * nights;
        subtotal += totalRoom;
        details.push(`${room.nameEs} × ${quantity} × ${nights} noche(s) = $${totalRoom.toFixed(2)}`);
      }
    }

    const iva = subtotal * 0.13;
    const hotelTax = subtotal * 0.05;
    const total = subtotal + iva + hotelTax;

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

    setLoading?.(true); // ✅ Mostrar loading externo

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
      setLoading?.(false);
      onSubmit();
    } catch {
      message.error("Error al guardar la reserva");
      setLoading?.(false);
    }
  };

  useEffect(() => {
    if (
      watchedRooms &&
      watchedRooms.length > 0 &&
      watchedInit &&
      watchedFinish &&
      availableRooms.length > 0
    ) {
      calculateSummary();
    }
  }, [watchedRooms, watchedInit, watchedFinish, availableRooms]);

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
        <Form.Item label="Cantidad de huespedes" name="cantPeople" rules={[{ required: true }]}> 
          <InputNumber size="large" min={1} style={{ width: "100%" }} />
        </Form.Item>

       {initialData && (
          <Form.Item label="Estado" name="status" rules={[{ required: true }]}> 
            <Select size="large">
              <Option value="FUTURA">FUTURA</Option>
              <Option value="ACTIVA">ACTIVA</Option>
              <Option value="FINALIZADA">FINALIZADA</Option>
              <Option value="PENDIENTE">PENDIENTE</Option>
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
                    <Form.Item
                      label={`Habitación #${index + 1}`}
                      name={[field.name, "roomId"]}
                      rules={[{ required: true }]}
                      shouldUpdate
                    >

                     <Select
                        showSearch
                        size="large"
                        placeholder="Selecciona habitación"
                        optionFilterProp="label"
                        disabled={availableRooms.length === 0}
                        onChange={() => setTimeout(() => calculateSummary(), 50)} // 🧠 forzamos cálculo
                      >

                      {availableRooms
                          .filter((room) => room.maxCapacity >= (form.getFieldValue("cantPeople") || 1))
                          .map((room) => (
                            <Option
                              key={room.roomId}
                              value={room.roomId}
                              label={`${room.nameEs} – $${room.price}`}
                              disabled={room.availableQuantity <= 0}
                            >
                              {`${room.nameEs} – $${room.price} (${room.availableQuantity} disponibles)`}
                            </Option>
                        ))}

                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item label="Cantidad" name={[field.name, "quantity"]} rules={[{ required: true }]}> 
                      <InputNumber
                        size="large"
                        min={1}
                        style={{ width: "100%" }}
                        onChange={() => setTimeout(() => calculateSummary(), 50)}
                      />

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

     <div
            style={{
              backgroundColor: "#f0f2f5",
              padding: "20px",
              borderRadius: "12px",
              marginBottom: 32,
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            }}
          >
            <Title level={4} style={{ marginBottom: 12 }}>Resumen de la reserva</Title>

            {summary.details.length > 0 ? (
              <div style={{ marginBottom: 16 }}>
                {summary.details.map((item, index) => (
                  <div key={index} style={{ marginBottom: 4, fontSize: "15px" }}>
                    • {item}
                  </div>
                ))}
              </div>
            ) : (
              <Text type="secondary">No hay habitaciones seleccionadas aún.</Text>
            )}

            <Divider style={{ margin: "12px 0" }} />

            <div style={{ fontSize: "16px", marginBottom: 4 }}>
              <Text>Subtotal:</Text>
              <Text style={{ float: "right" }} strong>${summary.subtotal.toFixed(2)}</Text>
            </div>
            <div style={{ fontSize: "16px", marginBottom: 4 }}>
              <Text>IVA (13%):</Text>
              <Text style={{ float: "right" }} strong>${summary.iva.toFixed(2)}</Text>
            </div>
            <div style={{ fontSize: "16px", marginBottom: 4 }}>
              <Text>Impuesto hotelero (5%):</Text>
              <Text style={{ float: "right" }} strong>${(summary.subtotal * 0.05).toFixed(2)}</Text>
            </div>
            <div style={{ fontSize: "17px", marginTop: 8 }}>
              <Text strong>Total:</Text>
              <Text style={{ float: "right" }} strong>${summary.total.toFixed(2)}</Text>
            </div>
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
