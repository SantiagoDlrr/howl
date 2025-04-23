interface Props {
    id: number;
    selected: boolean;
    setSelected: (id: number) => void;
    large?: boolean;
    label: string;
}

const ToggleButton = ({ id, selected, setSelected, large, label }: Props) => {
    // const label = id === 1 ? "Micrófono y dispositivo" : "Solo micrófono";
    const handleClick = () => {
        setSelected(id);
    }

    return (
        <button onClick={handleClick} className={`${selected && "bg-bg-extradark"} ${large && "p-1"} rounded-md px-2 flex-1 text-left`}>
            {label}
        </button>
    )
}

export default ToggleButton;