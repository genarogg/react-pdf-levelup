import React from 'react'
import Header from './Header';
import Nav from './Navegacion';

interface LayoutProps {
    children: React.ReactNode;
    context: String
}

const Layout: React.FC<LayoutProps> = ({ children, context }) => {
    return (
        <>
            <Header context={context} />
            {children}

            {context !== "playground" &&
                <>
                    <Nav />
                    <footer className="mt-8  border-t border-border pt-6 sm:p-8">
                        <p className="text-center text-xs sm:text-sm text-muted-foreground">
                            © {new Date().getFullYear()} react-pdf-levelup. Open source under MIT License.
                        </p>
                    </footer>
                </>
            }
        </>
    );
}

export default Layout;