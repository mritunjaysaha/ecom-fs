import { FC, ReactNode } from "react";
import { Navbar } from "./components/Navbar";

type RootLayoutProps = {
    children: ReactNode;
};

export const RootLayout: FC<RootLayoutProps> = ({ children }) => {
    return (
        <section>
            <Navbar />
            {children}
        </section>
    );
};
