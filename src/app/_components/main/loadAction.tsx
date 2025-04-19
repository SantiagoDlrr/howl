import { IconType } from "react-icons/lib";

interface loadActionProps {
    title: string;
    label: string;
    buttonLabel: string;
    onClick: () => void;
    icon: IconType;
}

const LoadAction = ({ title, label, buttonLabel, onClick, icon: Icon }: loadActionProps) => {
    return (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 flex flex-col items-center justify-center mb-6">
            <div className="mb-4 bg-purple-100 p-4 rounded-full">
                {/* <Upload className="w-8 h-8 text-purple-500" /> */}
                <Icon className="text-primary" />
                {/* icon added */}
            </div>
            <h3 className="text-xl font-medium text-purple-600 mb-2">
                {title}
            </h3>
            <p className="text-gray-500 mb-4">
                {label}
            </p>

            <button
                onClick={onClick}
                className="py-2 px-4 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition"
            >
                {buttonLabel}
            </button>
        </div>
    )
}

export default LoadAction;