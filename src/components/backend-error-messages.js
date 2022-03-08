export default function BackendErrorMessages({ errors }) {
    const errorMessages = Object.keys(errors).map(name => {
        const message = errors[name].join(" ");
        return (
            <li key={name}>{name}{" "}{message}</li>
        )
    })

    return (
        <ol className="error-messages">
            {errorMessages}
        </ol>
    )
}