import Bathroom from './components/scenes/Bathroom'

function App() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
      <h1
        className="text-2xl mb-4"
        style={{ fontFamily: "'Space Grotesk', sans-serif" }}
      >
        TradeU
      </h1>
      <Bathroom onTap={console.log} foundIds={[]} />
    </div>
  )
}

export default App
