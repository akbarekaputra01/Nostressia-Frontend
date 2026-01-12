import Router from "./router";
import PreviewGate from "./components/PreviewGate";

function App() {
  return (
    <PreviewGate>
      <Router />
    </PreviewGate>
  );
}

export default App;
