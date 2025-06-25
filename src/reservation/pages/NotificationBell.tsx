import { Badge } from "antd";
import { BellOutlined } from "@ant-design/icons";

interface Props {
  count: number;
  onClick: () => void;
}

export const NotificationBell = ({ count, onClick }: Props) => {
  return (
    <Badge count={count} overflowCount={99} size="small">
      <BellOutlined style={{ fontSize: 24, cursor: "pointer" }} onClick={onClick} />
    </Badge>
  );
};
