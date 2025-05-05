import RestrictedAccess from "@/app/_components/auth/restrictedAccess";
import CallStatsDashboard from "@/app/_components/logs/CallStatsDashboard";
import { auth } from "@/server/auth";
import CallLogsTable from "@/app/_components/logs/callLogsTable";

const LogCalls = async () => {
    const session = await auth();
    if (!session?.user) {
        return (
            <RestrictedAccess />
        )
    }
    return (
        <div className="h flex flex-col justify-center items-center pt-20">
            <CallStatsDashboard />
            <CallLogsTable />

            {/* <div className="bg-black w-80 h-2/3"></div> */}
        </div>
    )
}

export default LogCalls;