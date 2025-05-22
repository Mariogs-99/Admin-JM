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
  Card,
  Row,
  Col,
  Button,
} from "antd";
import { GetRooms } from "../../room/services/roomServices";
import { getAllCategoriesRoom } from "../../category/services/categoryService";
import { SaveReservations, UpdateReservation } from "../services/reservationService";
import dayjs from "dayjs";

const { Option } = Select;
const { Title, Text } = Typography;

interface ReservationFormModalProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: () => void;
  initialData?: any;
}

const calculateReservation = (
  price: number,
  checkIn: string,
  checkOut: string,
  quantity: number = 1
) => {
  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);
  const numberOfNights = Math.max(0, (checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));
  const subtotal = price * numberOfNights * quantity;
  const IVA = subtotal * 0.10;
  const total = subtotal + IVA;
  return { numberOfNights, subtotal, IVA, total };
};

export const ReservationFormModal: FC<ReservationFormModalProps> = ({
  visible,
  onCancel,
  onSubmit,
  initialData,
}) => {
  const [form] = Form.useForm();
  const [rooms, setRooms] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [filteredRooms, setFilteredRooms] = useState<any[]>([]);
  const [selectedRoomPrice, setSelectedRoomPrice] = useState<number>(0);
  const [dates, setDates] = useState<{ checkIn?: string; checkOut?: string }>({});
  const [calculatedValues, setCalculatedValues] = useState<{
    numberOfNights: number;
    subtotal: number;
    IVA: number;
    total: number;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [roomsData, categoriesData] = await Promise.all([
          GetRooms(),
          getAllCategoriesRoom(),
        ]);
        setRooms(roomsData);
        setCategories(categoriesData);
        setFilteredRooms(roomsData);
      } catch (err) {
        console.error("Error al cargar habitaciones o categorías", err);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (!visible || !initialData) return;

    const {
      name,
      phone,
      email,
      cantPeople,
      quantityReserved,
      room,
      initDate,
      finishDate,
      payment,
    } = initialData;

    if (rooms.length === 0) return;

    const initDay = `${initDate[0]}-${String(initDate[1]).padStart(2, "0")}-${String(initDate[2]).padStart(2, "0")}`;
    const finishDay = `${finishDate[0]}-${String(finishDate[1]).padStart(2, "0")}-${String(finishDate[2]).padStart(2, "0")}`;

    form.setFieldsValue({
      name,
      phone,
      email,
      cantPeople,
      quantityReserved,
      initDate: dayjs(initDay),
      finishDate: dayjs(finishDay),
      roomId: room?.roomId,
      payment,
    });

    setFilteredRooms(rooms);
    setSelectedRoomPrice(room?.price ?? 0);
    calculatePrice(room?.price, initDay, finishDay);
    setDates({ checkIn: initDay, checkOut: finishDay });
  }, [initialData, visible, rooms]);

  const handleCategoryFilterChange = (categoryId?: number) => {
    if (!categoryId) {
      setFilteredRooms(rooms);
      return;
    }

    const result = rooms.filter(room => room.categoryRoomId === categoryId);
    setFilteredRooms(result);

    const currentRoomId = form.getFieldValue("roomId");
    const stillValid = result.some(room => room.roomId === currentRoomId);

    if (!stillValid) {
      form.setFieldsValue({ roomId: null });
      setSelectedRoomPrice(0);
      setCalculatedValues(null);
      setTimeout(() => form.validateFields(["roomId"]), 0);
    }
  };

  const handleRoomChange = (roomId: number) => {
    const selectedRoom = rooms.find((r) => r.roomId === roomId);
    if (selectedRoom) {
      setSelectedRoomPrice(selectedRoom.price);
      calculatePrice(selectedRoom.price, dates.checkIn, dates.checkOut);
    }
  };

  const onDateChange = (field: "checkIn" | "checkOut", date: any) => {
    const formattedDate = date ? date.format("YYYY-MM-DD") : undefined;
    const newDates = { ...dates, [field]: formattedDate };
    setDates(newDates);
    calculatePrice(selectedRoomPrice, newDates.checkIn, newDates.checkOut);
  };

  const calculatePrice = (price: number, checkIn?: string, checkOut?: string) => {
    const quantity = form.getFieldValue("quantityReserved") || 1;

    if (price && checkIn && checkOut) {
      const values = calculateReservation(price, checkIn, checkOut, quantity);
      form.setFieldsValue({ payment: parseFloat(values.total.toFixed(2)) });
      setCalculatedValues(values);
    } else {
      setCalculatedValues(null);
    }
  };

  const compactStyle = { height: 36, borderRadius: 6, paddingInline: 8 };

  const handleFinish = async (values: any) => {
    if (loading) return;
    setLoading(true);
    try {
      const formatted = {
        ...values,
        initDate: values.initDate.format("YYYY-MM-DD"),
        finishDate: values.finishDate.format("YYYY-MM-DD"),
      };

      if (initialData?.reservationId) {
        await UpdateReservation(initialData.reservationId, formatted);
        message.success("Reserva actualizada exitosamente");
      } else {
        await SaveReservations(formatted);
        message.success("Reserva guardada exitosamente");
      }

      onSubmit();
      form.resetFields();
      setDates({});
      setSelectedRoomPrice(0);
      setCalculatedValues(null);
    } catch (err) {
      message.error("Por favor completa todos los campos obligatorios.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={visible}
      title={<Title level={5} style={{ margin: 0 }}>{initialData ? "Editar Reserva" : "Nueva Reserva"}</Title>}
      onCancel={() => {
        onCancel();
        form.resetFields();
        setDates({});
        setSelectedRoomPrice(0);
        setCalculatedValues(null);
      }}
      footer={null}
      centered
      width={680}
    >
      <Form layout="vertical" form={form} onFinish={handleFinish} style={{ marginTop: 8 }}>
        <Row gutter={[12, 8]}>
          <Col span={12}>
            <Form.Item name="name" label="Nombre completo" rules={[{ required: true }]}>
              <Input style={compactStyle} placeholder="Nombre del cliente" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="phone" label="Teléfono" rules={[{ required: true }]}>
              <Input style={compactStyle} maxLength={9} placeholder="00000000" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item name="email" label="Correo electrónico" rules={[{ required: true, type: "email" }]}>
              <Input style={compactStyle} placeholder="ejemplo@correo.com" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="cantPeople" label="Personas" rules={[{ required: true }]}>
              <InputNumber min={1} max={20} style={{ width: "100%", ...compactStyle }} />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item name="quantityReserved" label="Habitaciones" rules={[{ required: true }]}>
              <InputNumber
                min={1}
                max={10}
                style={{ width: "100%", ...compactStyle }}
                onChange={() => calculatePrice(selectedRoomPrice, dates.checkIn, dates.checkOut)}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Categoría">
              <Select placeholder="Filtrar categoría" onChange={handleCategoryFilterChange} allowClear style={compactStyle}>
                {categories.map((cat) => (
                  <Option key={cat.categoryRoomId} value={cat.categoryRoomId}>
                    {cat.nameCategoryEs}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item name="roomId" label="Habitación" rules={[{ required: true }]}>
              <Select placeholder="Selecciona habitación" onChange={handleRoomChange} style={compactStyle}>
                {filteredRooms.map((room) => (
                  <Option key={room.roomId} value={room.roomId}>
                    {room.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name="initDate" label="Entrada" rules={[{ required: true }]}>
              <DatePicker style={{ width: "100%", ...compactStyle }} onChange={(date) => onDateChange("checkIn", date)} />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name="finishDate" label="Salida" rules={[{ required: true }]}>
              <DatePicker style={{ width: "100%", ...compactStyle }} onChange={(date) => onDateChange("checkOut", date)} />
            </Form.Item>
          </Col>
        </Row>

        <Divider style={{ margin: "12px 0" }} />

        <Form.Item name="payment" label={<Text strong>Total con IVA</Text>} rules={[{ required: true }]}>
          <InputNumber
            disabled
            style={{
              width: "100%",
              fontWeight: "bold",
              fontSize: "16px",
              color: "#000",
              borderRadius: 6,
              border: "1px solid #d9d9d9",
              background: "transparent",
            }}
            formatter={(value) => `$ ${value}`}
            parser={(value?: string) => parseFloat((value || "0").replace(/\$\s?|(,*)/g, ""))}
          />
        </Form.Item>

        {calculatedValues && (
          <Card size="small" style={{ background: "#fcfcfc", borderRadius: 6, marginTop: 8 }}>
            <Text>Precio/noche: <b>${selectedRoomPrice.toFixed(2)}</b></Text><br />
            <Text>Noches: <b>{calculatedValues.numberOfNights}</b></Text><br />
            <Text>Habitaciones reservadas: <b>{form.getFieldValue("quantityReserved") || 1}</b></Text><br />
            <Text>Subtotal: <b>${calculatedValues.subtotal.toFixed(2)}</b></Text><br />
            <Text>IVA (10%): <b>${calculatedValues.IVA.toFixed(2)}</b></Text>
          </Card>
        )}

        <Row justify="end" style={{ marginTop: 16 }}>
          <Button onClick={onCancel} style={{ marginRight: 8, borderRadius: 6 }}>
            Cancelar
          </Button>
          <Button type="primary" htmlType="submit" loading={loading} style={{ borderRadius: 6 }}>
            {initialData ? "Actualizar" : "Guardar"}
          </Button>
        </Row>
      </Form>
    </Modal>
  );
};
