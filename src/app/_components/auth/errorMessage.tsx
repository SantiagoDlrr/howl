
const ErrorMessage = ({ message }: { message: string }) => {
    return (
        <p className="w-full mb-6  rounded-sm border-red-500 bg-red-200  px-2 py-1 text-red-500">
            {message}
        </p>
    )
}

export default ErrorMessage;