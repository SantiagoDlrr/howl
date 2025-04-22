
const CompanyTable = () => {

    const logs = [
        {
            callDate: '2023-10-01',
            client: 'John Doe',
            clientCompany: 'Softek',
            category: 'Technical Support',
            rating: 'Positive',
            time: '10:00 AM',
        },
        {
            callDate: '2023-10-02',
            client: 'Jane Smith',
            clientCompany: 'Tech Corp',
            category: 'Sales Inquiry',
            rating: 'Negative',
            time: '11:00 AM',
        },
        // Add more log entries as needed
    ];

    return (
        <div className="bg-bg h-screen pt-24 px-20 w-full">

            <div className="overflow-x-auto rounded border border-black w-full">

                <table className="w-full border-collapse text-sm">
                    <thead>
                        <tr className="bg-gray-100 border-b">
                            <th className="p-3 text-left">Empresa</th>
                            <th className="p-3 text-left">Ver</th>
                            {/* <th className="p-3 text-left">Editar</th> */}
                        </tr>
                    </thead>
                    <tbody>
                        {logs.map((log, index) => (
                            <tr
                                key={index}
                                className="border-b hover:bg-gray-50 transition-colors"
                            >
                                <td className="p-3">{log.client}</td>
                                {/* <td className="p-3">
                        <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                            {log.category}
                        </span>
                    </td> */}
                                <td className="p-3 flex flex-row gap-2">
                                    <button className="bg-bg-dark text-text px-3 py-1 rounded hover:bg-bg-extradark transition-colors">
                                        Ver contactos
                                    </button>
                                    <button className="bg-purple-500 text-white px-3 py-1 rounded hover:bg-purple-600 transition-colors">
                                        Editar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

            </div>
        </div>
    )
}

export default CompanyTable;