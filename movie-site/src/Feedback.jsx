export default function Feedback() {
    return (
      <div className="max-w-3xl mx-auto px-6 py-10 bg-black text-white">
        <h2 className="text-3xl font-bold mb-6 text-[#ffc211]">Send me your feedback</h2>
  
        <div className="relative overflow-hidden rounded-xl shadow-lg" style={{ minHeight: "600px" }}>
          <iframe
            src="https://docs.google.com/forms/d/e/YOUR_FORM_ID/viewform?embedded=true"
            width="100%"
            height="600"
            frameBorder="0"
            marginHeight="0"
            marginWidth="0"
            title="Feedback Form"
          >
            Loading…
          </iframe>
        </div>
      </div>
    )
  }
  