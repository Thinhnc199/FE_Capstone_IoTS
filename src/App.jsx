
import AppRoutes from "./routes/AppRoutes"; 
import { Provider } from "react-redux";
import store from "./redux/store";

const App = () => {
  return (
    <Provider store={store}>
      <div className="min-h-screen bg-gray-100">
        <AppRoutes /> 
      </div>
    </Provider>
  );
};

export default App;
