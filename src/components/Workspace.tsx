import "../styles/Workspace.css"
import Sidebar from "./Sidebar";
import Textarea from "./Textarea";
import Time from "./Time";

function Workspace() {
    return (
        <div className="background">
            <Time/>

            <Sidebar></Sidebar>
            <Textarea></Textarea>
        </div>
    );
}

export default Workspace;