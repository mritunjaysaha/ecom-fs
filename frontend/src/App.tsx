import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./AppRoutes";
import { RootLayout } from "./RootLayout";

function App() {
    return (
        <BrowserRouter>
            <RootLayout>
                <AppRoutes />
            </RootLayout>
        </BrowserRouter>
    );
}

export default App;
