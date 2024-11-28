import {CommandModal} from "./commandModal"

export default () => {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  
  return ( 
    <div className={`${theme === "dark" ? "dark" : ""}`} >
      <CommandModal setTheme={setTheme} theme ={theme}/>
    </div>
  );
};

