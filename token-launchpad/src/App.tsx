import {
  WalletDisconnectButton,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import "./App.css";

function App() {
  return (
    <>
      <div className="bg-gray-800 h-screen flex-col flex items-center justify-center">
        <h1 className="text-4xl font-bold text-white">
          Welcome to the Solana App
        </h1>

        <div className="mt-4 flex space-x-4">
          <WalletMultiButton className="" />
          <WalletDisconnectButton className="" />
        </div>

        <button
          onClick={() => (window.location.href = "/token-launchpad")}
          className="mt-4 bg-blue-500 text-white font-bold py-2 px-4 rounded hover:cursor-pointer hover:bg-blue-600 transition duration-300"
        >
          Go to Token Launchpad
        </button>
      </div>
    </>
  );
}

export default App;
