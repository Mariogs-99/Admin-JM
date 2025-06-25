import { Badge } from "antd";
import { BellOutlined } from "@ant-design/icons";

interface Props {
  count: number;
  onClick: () => void;
}

export const NotificationBell = ({ count, onClick }: Props) => {
  return (
    <Badge count={count} overflowCount={99} size="default" offset={[-2, 2]}>
      <BellOutlined
        style={{ fontSize: 30, cursor: "pointer", color: "#555" }}
        onClick={onClick}
      />
    </Badge>
  );
};
