import { gql } from "apollo-boost";
import { ME } from "./screens/Tabs/Profile";
import { useQuery } from "@apollo/react-hooks";

const meChecker = () => {
  const { loading, data, refetch } = useQuery(ME);
  return { loading, data, refetch };
};

export default meChecker;
