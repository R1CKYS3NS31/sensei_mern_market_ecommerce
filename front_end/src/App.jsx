
import { BrowserRouter as Router} from "react-router-dom";
import { MainRouter } from "./MainRouter";
import { ThemeProvider } from "@emotion/react";
import theme from "./styles/theme";
import Menu from "./components/Menu";

function App() {

  // dispatching
  // const dispatch = useDispatch();

  // useEffect(() => {

  //   // replace with your API endpoints calls

  //   // fetch foods from api
  //   const fetchFoods = async () => {
  //     const response = await client.get('http://localhost:9000/apiv1/foods')
  //     dispatch(setFoods(response))
  //   }

  //   fetchFoods()

  // }, [dispatch])

  return (
    <Router>
      <ThemeProvider theme={theme}>
        <Menu/>
        <MainRouter />
      </ThemeProvider>
    </Router>
  )
}

export default App;
