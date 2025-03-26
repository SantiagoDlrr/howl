
const ToggleButton = ({ id, selected, setSelected }: { id: number, selected: boolean, setSelected: (id: number) => void }) => {
    const label = id === 1 ? "Usuario" : "Empresa";
    const handleClick = () => {
        console.log(id);
        setSelected(id);
    }

    return (
        <button onClick={handleClick} className={`${selected && "bg-bg-extradark"} rounded-md px-2 flex-1 text-left`}>
            {label}
        </button>
    )
}

export default ToggleButton;