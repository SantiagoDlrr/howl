import CallLogsTable from "howl/app/_components/logs/callLogsTable";
const LogCalls = () => {
    return (
        <div className="h flex flex-col justify-center items-center pt-20">
            <img src="/images/logsGraphEx.png" alt="graficas" className="w-1/2 h-auto" />
            <CallLogsTable />
            
            {/* <div className="bg-black w-80 h-2/3"></div> */}
        </div>
    )
}

export default LogCalls;