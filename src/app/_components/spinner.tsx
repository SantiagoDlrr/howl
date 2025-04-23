import { RingLoader } from "react-spinners"

const Spinner = () => {
    return (
        <div className="h-full w-full flex justify-center items-center">
            <RingLoader
                color="#A836FF"
                loading={true}
                size={50}
            />
        </div>
    )
}

export default Spinner;