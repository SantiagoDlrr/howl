interface DoubleButtonsProps {
    labels: string[];
    onClick1?: () => void;
    onClick2?: () => void;
    types: ("button" | "submit")[];
}

const DoubleButtons = ({labels, onClick1, onClick2, types} : DoubleButtonsProps) => {
    return (
        <div>
            <div className="flex flex-row gap-3">
                <button type={types[0]} onClick={onClick1} className="flex-1 w-full bg-bg-dark text-text px-3 py-1 rounded hover:bg-bg-extradark transition-colors">
                    {labels[0]}
                </button>
                <button type={types[1]} onClick={onClick2} className="flex-1 bg-purple-500 text-white px-3 py-1 rounded hover:bg-purple-600 transition-colors">
                    {labels[1]}
                </button>
            </div>
        </div>
    )
}

export default DoubleButtons;