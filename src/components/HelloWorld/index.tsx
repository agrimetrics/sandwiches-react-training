import { useGetSchedule } from "@services";

export function HelloWorld() {
  const { data } = useGetSchedule()
  return (
    <div>{JSON.stringify(data?.schedule)}</div>
  )
}
