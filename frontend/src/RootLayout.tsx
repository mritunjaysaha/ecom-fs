import { FC, ReactNode } from "react";

type RootLayoutProps = {
    children: ReactNode;
};

export const RootLayout: FC<RootLayoutProps> = ({ children }) => {
    return (
        <section>
            <nav>Cart </nav>
            {children}
        </section>
    );
};
