interface CallLogEntry {
    callDate: string;
    client: string;
    clientCompany: string;
    category: string;
    rating: string;
    time: string;
};

interface TableProps {
    logs: CallLogEntry[];
}
const LogsTable = ({ logs }: TableProps) => {
    return (

        <div className="w-full overflow-x-auto rounded border border-black">
            <table className="w-full border-collapse text-sm text-center">
                <thead>
                    <tr className="bg-gray-100 border-b">
                        <th className="p-3">Call Date</th>
                        <th className="p-3">Client</th>
                        <th className="p-3">Client Company</th>
                        <th className="p-3">Category</th>
                        <th className="p-3">Rating</th>
                        <th className="p-3">Time</th>
                        <th className="p-3">AI Menu</th>
                    </tr>
                </thead>
                <tbody>
                    {logs.map((log, index) => (
                        <tr
                            key={index}
                            className="border-b hover:bg-gray-50 transition-colors"
                        >
                            <td className="p-3">{log.callDate}</td>
                            <td className="p-3">{log.client}</td>
                            <td className="p-3">{log.clientCompany}</td>
                            <td className="p-3">
                                <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                                    {log.category}
                                </span>
                            </td>
                            <td className="p-3">
                                <span className={`
                    font-semibold 
                    ${log.rating === 'Positive' ? 'text-green-600' : 'text-red-600'}
                  `}>
                                    {log.rating}
                                </span>
                            </td>
                            <td className="p-3">{log.time}</td>
                            <td className="p-3">
                                <button className="bg-purple-500 text-white px-3 py-1 rounded hover:bg-purple-600 transition-colors">
                                    View AI
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>


        </div>

    )
}

export default LogsTable;
