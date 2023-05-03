import { Home } from "./pages/Home";
import { BrowserRouter as Router, Link, Route, Routes } from "react-router-dom";
import { useDispatch } from "react-redux";
import { client } from "./services/api/Client";
import { useEffect } from "react";
import { setFoods } from "./services/redux/slices/FoodSlice";

function App() {

  // dispatching
  const dispatch = useDispatch();

  useEffect(() => {

    // replace with your API endpoints calls

    // fetch foods from api
    const fetchFoods = async () => {
      const response = await client.get('http://localhost:9000/apiv1/foods')
      dispatch(setFoods(response))
    }

    fetchFoods()

  }, [dispatch])

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={<Home />}
          // element={!user ? <SignInSide /> : <Home user={user} />}
          exact
        />

        {/* no route */}
        <Route
          path="*"
          element={
            <main
              style={{
                padding: "1rem",
                height: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
              }}
            >
              <h1>There's nothing here!</h1>
              <Link to={"/"}>
                <button
                  style={{
                    textDecoration: "none",
                    border: "none",
                    width: 120,
                    borderRadius: 5,
                    padding: "20px",
                    backgroundColor: "black",
                    color: "white",
                    fontWeight: "600",
                    cursor: "pointer",
                  }}
                >
                  Go Back Home
                </button>
              </Link>
            </main>
          }
        />
      </Routes>
    </Router>
  )
}

export default App;
