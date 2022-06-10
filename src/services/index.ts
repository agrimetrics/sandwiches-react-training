import { useQuery, UseQueryOptions } from 'react-query';

import { Schedule } from '../serverTypes';
import config from '@config';

export const GET_SCHEDULE_QUERY_KEY = 'getSchedule';

const getSchedule = async () => {
  const res = await fetch(`${config.apiUrl}/schedule`)
  const data = await res.json();
  return data;
};

type Response = Schedule.GetSchedule.ResponseBody;

type GetDataSetOptions = Omit<UseQueryOptions<Response>, "queryKey" | "queryFn"> | undefined;

export const useGetSchedule = (options?: GetDataSetOptions) => {
  const { isSuccess, data, ...rest } = useQuery<Response>(
    GET_SCHEDULE_QUERY_KEY,
    () => getSchedule(),
    options,
  );

  return { isSuccess, data, ...rest };
};
