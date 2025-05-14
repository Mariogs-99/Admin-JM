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
  onSubmit: () => void; // 👈 Cambiado para no aceptar data innecesaria
  initialData?: any;
}

const calculateReservation = (price: number, checkIn: string, checkOut: string) => {
  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);
  const numberOfNights = Math.max(0, (checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));
  const subtotal = price * numberOfNights;
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
    categoryroom,
    room,
    initDate,
    finishDate,
    payment,
  } = initialData;

  if (rooms.length === 0) return;

  const initDay = `${initDate[0]}-${String(initDate[1]).padStart(2, "0")}-${String(initDate[2]).padStart(2, "0")}`;
  const finishDay = `${finishDate[0]}-${String(finishDate[1]).padStart(2, "0")}-${String(finishDate[2]).padStart(2, "0")}`;

  // Cargar campos base sin habitación aún
  form.setFieldsValue({
    name,
    phone,
    email,
    cantPeople,
    categoryRoomId: categoryroom?.categoryRoomId,
    initDate: dayjs(initDay),
    finishDate: dayjs(finishDay),
    payment,
  });

  const filtered = rooms.filter(r => r.categoryRoom.categoryRoomId === categoryroom.categoryRoomId);
  setFilteredRooms(filtered);

  const stillValid = filtered.some(r => r.roomId === room.roomId);
  if (stillValid) {
    form.setFieldsValue({ roomId: room.roomId });
    setSelectedRoomPrice(room.price);
    calculatePrice(room.price, initDay, finishDay);
  } else {
    form.setFieldsValue({ roomId: null }); // ❗️limpiar campo
    setSelectedRoomPrice(0);
    setCalculatedValues(null);

    // 🔁 Forzar validación visual del campo
    setTimeout(() => form.validateFields(["roomId"]), 0);
  }

  setDates({ checkIn: initDay, checkOut: finishDay });
}, [initialData, visible, rooms]);


  const handleCategoryChange = (categoryId: number) => {
  const result = rooms.filter(room => room.categoryRoom.categoryRoomId === categoryId);
  setFilteredRooms(result);

  const currentRoomId = form.getFieldValue("roomId");
  const stillValid = result.some(room => room.roomId === currentRoomId);

  if (stillValid) {
    const room = result.find(r => r.roomId === currentRoomId);
    if (room) {
      setSelectedRoomPrice(room.price);
      calculatePrice(room.price, dates.checkIn, dates.checkOut);
    }
  } else {
    form.setFieldsValue({ roomId: null }); // 👈 Limpia el campo visualmente
    setSelectedRoomPrice(0);
    setCalculatedValues(null);
    setTimeout(() => form.validateFields(["roomId"]), 0); // 👈 Revalida visualmente
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
    if (price && checkIn && checkOut) {
      const values = calculateReservation(price, checkIn, checkOut);
      form.setFieldsValue({ payment: parseFloat(values.total.toFixed(2)) });
      setCalculatedValues(values);
    } else {
      setCalculatedValues(null);
    }
  };

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

      onSubmit(); // ✅ Ya no se pasan los datos, se evita duplicación
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
      title={<Title level={4}>{initialData ? "Editar Reserva" : "Nueva Reserva"}</Title>}
      onCancel={() => {
        onCancel();
        form.resetFields();
        setDates({});
        setSelectedRoomPrice(0);
        setCalculatedValues(null);
      }}
      footer={null}
      centered
    >
      <Form layout="vertical" form={form} onFinish={handleFinish} style={{ paddingTop: 10 }}>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="name" label="Nombre completo" rules={[{ required: true }, {pattern: /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/, message: "Solo se permiten letras y espacios",},]}>
              <Input placeholder="Nombre del cliente" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="phone" label="Teléfono"  rules={[
              { required: true, message: "El teléfono es obligatorio" },
              {
                message: "Formato inválido. Usa 00000000",
              },
            ]}>
              <Input placeholder="00000000" maxLength={9} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="email" label="Correo electrónico"  rules={[
                { required: true, message: "El correo es obligatorio" },
                { type: "email", message: "El formato del correo no es válido" },
              ]}>
              <Input type="email" placeholder="ejemplo@correo.com" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="cantPeople" label="Cantidad de personas" rules={[{ required: true }]}>
              <InputNumber min={1} max={10} style={{ width: "100%" }} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="categoryRoomId" label="Categoría" rules={[{ required: true }]}>
              <Select placeholder="Seleccione una categoría" onChange={handleCategoryChange}>
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
              <Select placeholder="Seleccione una habitación" onChange={handleRoomChange}>
                {filteredRooms.map((room) => (
                  <Option key={room.roomId} value={room.roomId}>
                    {room.nameEs}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="initDate" label="Fecha de entrada" rules={[{ required: true }]}>
              <DatePicker style={{ width: "100%" }} onChange={(date) => onDateChange("checkIn", date)} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="finishDate" label="Fecha de salida" rules={[{ required: true }]}>
              <DatePicker style={{ width: "100%" }} onChange={(date) => onDateChange("checkOut", date)} />
            </Form.Item>
          </Col>
        </Row>

        <Divider />

        <Form.Item
          name="payment"
          label={<Text strong>Monto total con IVA</Text>}
          rules={[{ required: true }]}
        >
          <InputNumber
            min={0}
            disabled
            style={{ width: "100%", fontWeight: "bold", background: "#f9f9f9" }}
            formatter={(value) => `$ ${value}`}
            parser={(value?: string) => parseFloat((value || "0").replace(/\$\s?|(,*)/g, ""))}
          />
        </Form.Item>

        {calculatedValues && (
          <Card size="small" style={{ background: "#fafafa", marginTop: 10 }}>
            <Text>Precio por noche: <b>${selectedRoomPrice.toFixed(2)}</b></Text><br />
            <Text>Noches: <b>{calculatedValues.numberOfNights}</b></Text><br />
            <Text>Subtotal: <b>${calculatedValues.subtotal.toFixed(2)}</b></Text><br />
            <Text>IVA (10%): <b>${calculatedValues.IVA.toFixed(2)}</b></Text>
          </Card>
        )}

        <Row justify="end" style={{ marginTop: 20 }}>
          <Button onClick={onCancel} style={{ marginRight: 8 }}>
            Cancelar
          </Button>
          <Button type="primary" htmlType="submit" loading={loading}>
            {initialData ? "Actualizar" : "Guardar"}
          </Button>
        </Row>
      </Form>
    </Modal>
  );
};
