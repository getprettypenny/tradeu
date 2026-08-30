export default function SignupThankYou() {
  return (
    <div
      className="mx-5 mb-6 rounded-2xl p-5 text-center"
      style={{ background: '#EAF7EE', border: '1px solid var(--green)' }}
    >
      <p className="text-base font-semibold mb-1" style={{ color: 'var(--green)' }}>
        ✅ You're on the list
      </p>
      <p className="text-sm" style={{ color: 'var(--ink-2)' }}>
        We'll reach out the moment more lessons are ready.
      </p>
    </div>
  )
}
