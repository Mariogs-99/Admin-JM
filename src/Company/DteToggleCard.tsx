import { useEffect, useState } from "react";
import { Switch, message, Card, Spin} from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import { getCompany, updateDteEnabled } from "./companyService";

export const DteToggleCard = () => {
  const [enabled, setEnabled] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchCompany = async () => {
    try {
      const company = await getCompany();
      setEnabled(company.dteEnabled);
    } catch (error) {
      message.error("Error cargando configuración de empresa");
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (checked: boolean) => {
    try {
      setEnabled(checked);
      await updateDteEnabled(checked);
      message.success(`DTE ${checked ? "activado" : "desactivado"}`);
    } catch (error) {
      message.error("No se pudo actualizar la configuración");
      setEnabled(!checked); // revertir si falla
    }
  };

  useEffect(() => {
    fetchCompany();
  }, []);

  return (
    <Card
      style={{
        marginTop: 32,
        borderRadius: "12px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        border: "1px solid #f0f0f0",
      }}
    >
      <div className="flex items-center justify-between gap-6 flex-wrap">
        <div className="flex items-start gap-3 flex-1 min-w-[250px]">
          <InfoCircleOutlined className="text-blue-500 text-xl mt-1" />
          <div>
            <div className="text-base font-semibold text-gray-800">
              Emisión de DTE
            </div>
            <p className="text-sm text-gray-500">
              Habilita o deshabilita la generación de facturas electrónicas (DTE)
              automáticamente al confirmar una reserva.
            </p>
          </div>
        </div>

        {loading ? (
          <Spin />
        ) : (
          <Switch
            checked={enabled}
            onChange={handleToggle}
            checkedChildren="Activado"
            unCheckedChildren="Desactivado"
            className="scale-125"
          />
        )}
      </div>
    </Card>
  );
};
