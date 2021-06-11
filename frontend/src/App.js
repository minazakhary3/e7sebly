import React from "react";
import { Switch, Route } from "react-router-dom";
import { Home, Create, Receipt, Join } from "./Pages";
import { SocketContext, socket } from "./Context/socket";
import "./styles/app.sass";

function App() {
    return (
        <SocketContext.Provider value={socket}>
            <div className="app-box">
                <Switch>
                    <Route exact={true} path="/" component={Home} />
                    <Route exact={true} path="/create" component={Create} />
                    <Route exact={true} path="/join/:id?" component={Join} />
                    <Route
                        exact={true}
                        path="/receipt/:id"
                        component={Receipt}
                    />
                    <Route exact={true} path="/dashboard/:id/:option?" />
                </Switch>
            </div>
        </SocketContext.Provider>
    );
}

export default App;
