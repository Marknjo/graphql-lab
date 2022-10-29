export default function ErrorUI({ message, heading }) {
  return (
    <div
      className='message is-danger'
      style={{ maxWidth: "50%", margin: "0 auto" }}>
      <div className='message-header'>
        <p>{heading || "Error"}</p>
        <button className='delete' aria-label='delete'></button>
      </div>
      <div className='message-body'>
        <p>{message || "Fetching content failed"}</p>
      </div>
    </div>
  );
}
