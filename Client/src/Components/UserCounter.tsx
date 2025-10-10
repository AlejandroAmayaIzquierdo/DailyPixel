import { Users } from "lucide-react";

interface UserCounterProps {
  count: number;
}
const UserCounter: React.FC<UserCounterProps> = ({ count }) => {
  return (
    <div className="absolute top-0 right-0 rounded-md w-20 h-10 bg-gray-500/20 backdrop-blur-sm border-2 border-gray-200 p-2 m-5 text-white font-semibold flex items-center justify-center gap-2">
      <span>{count}</span>
      <Users />
    </div>
  );
};

export default UserCounter;
