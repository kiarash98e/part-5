import React from 'react'
import About from './components/about/about'
import Home from './components/home/home'
import Data from './data/data'
import {VisuallyHidden} from '@reach/visually-hidden'
import { Link, Route, Routes, useParams, Navigate, useLocation ,useNavigate, useSearchParams } from 'react-router-dom'




function Invoices({ users }) {

  const user = [
    { id: '1', fullName: 'sport' },
    { id: '2', fullName: 'fashion' },
  ];
  return (
    <>
      <h1>Invoices</h1>
      <ul>
        {
          users.map((user) => (
            <li key={user.id}>
              <Link to={user.id} >
                {user.fullName}
              </Link>
            </li>
          ))
        }
      </ul>
      <Link to={"/invoices/sport/"}>sport</Link>
      <Routes>
        <Route path=":userId" element={<User name={users} />} />
        <Route path='/sport/*' element={<Sport user={user} />} />
      </Routes>

    </>
  );
}

function Sport(props) {

  return (
    <>
      <h2>model</h2>
      <ul>
        {
          props.user.map((user) => (
            <li key={user.id}>
              <Link to={user.fullName} >
                {user.fullName}
              </Link>
            </li>
          ))
        }
      </ul>
      <Routes>
        <Route path=':Id' element={<Modal />} />
      </Routes>
    </>
  )
}

function Modal() {

  const { Id } = useParams()
  return (
    <>
      <h2>model {Id} </h2>

    </>
  )
}

function User(props) {
  const { userId } = useParams()
  const nav = useNavigate() 
  return (
    <>
      <h2>user :{userId} {props.name.map((name) => name.id === userId ? `${name.fullName}` : '')}</h2>
      <button onClick={() => nav("/invoices")}>back to url</button>
    </>
  );
}

function SneakerView() {
  let { id } = useParams();

  if (!id) {
    return null;
  }

  function getSneakerById(id) {
    return Data.find((sneaker) => sneaker.id === id);
  }

  let snkr = getSneakerById(id);

  if (!snkr) {
    return null;
  }

  let name = `${snkr.brand} ${snkr.model} ${snkr.colorway}`;

  return (
    <div>
      <h2>{name}</h2>
      <img
        width={400}
        height={400}
        style={{
          borderRadius: "8px",
          maxWidth: "100%",
          aspectRatio: "1 / 1",
        }}
        src={snkr.imageUrl}
        alt={name}
      />
    </div>
  );
}

function SearchView() {
  return(
    <>
      <Routes>
        <Route path='/' element={<Layout/>}>
          <Route index element={<SneakerGrid />} />
          <Route path="/search/:id" element={<SneakerView />} />
         
        </Route>
      </Routes>
    </>
  )
}



function SneakerGrid() {
  let [searchParams] = useSearchParams();
  let brand = searchParams.get("brand");

  function filterByBrand(brand) {
    return Data.filter(
      (sneaker) => sneaker.brand.toLowerCase() === brand.toLowerCase()
    );
  }

  const sneakers = React.useMemo(() => {
    if (!brand) return Data;
    return filterByBrand(brand);
  }, [brand]);

  return (
    <main>
      <h2>Sneakers</h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
          gap: "12px 24px",
        }}
      >
        {sneakers.map((snkr) => {
          let name = `${snkr.brand} ${snkr.model} ${snkr.colorway}`;
          return (
            <div key={snkr.id} style={{ position: "relative" }}>
              <img
                width={200}
                height={200}
                src={snkr.imageUrl}
                alt={name}
                style={{
                  borderRadius: "8px",
                  width: "100%",
                  height: "auto",
                  aspectRatio: "1 / 1",
                }}
              />
              <Link
                style={{ position: "absolute", inset: 0 }}
                to={`/search/${snkr.id}`}
              >
                <VisuallyHidden>{name}</VisuallyHidden>
              </Link>
              <div>
                <p>{name}</p>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}

function Layout() {
  let brands = [...new Set(Data.map((item) => item.brand))]
  return (
    <div>
      <nav>
        <h3>Filter by brand</h3>
        <ul>
          <li>
            <Link to="/search">All</Link>
          </li>
          {brands.map((brand) => (
            <li key={brand}>
              <BrandLink brand={brand}>{brand}</BrandLink>
            </li>
          ))}
        </ul>
      </nav>

      <hr />

      
    </div>
  );
}

function BrandLink({ brand, children, ...props }) {
  let [searchParams] = useSearchParams();
  let isActive = searchParams.get("brand") === brand;

  return (
    <Link
      to={`/search/?brand=${brand}`}
      {...props}
      style={{
        ...props.style,
        color: isActive ? "red" : "black",
      }}
    >
      {children}
    </Link>
  ); 
}

function Dashboard() {
  
  return <>
    <h1>Dashboard</h1>
  </>;
};


function ProtectedRoute({
  user,
  redirectPath = '/invoices/sport',
  children,
}) {
  
  if (!user) {
    return <Navigate to={redirectPath} replace />;
  }

  return children;
};


function CustomLi ({to,children,...props}) {
  const resolve = useLocation()
  const match = resolve.pathname === to
  return (
    <div>
      <Link
        style={{ textDecoration: match ? "underline" : "none" }}
        to={to.toString()}
        {...props}
      >
        {children}
      </Link>
      {match && " (active)"}
    </div>
  );
}

function App() {
  const nav = useNavigate()

  const users = [
    { id: '1', fullName: 'Robin Wieruch' },
    { id: '2', fullName: 'Sarah Finnley' },
  ];

  const {state} = useLocation()
  const url = "invoices"
  const [user, setUser] = React.useState(null)
  console.log(state?.from)
  const handleLogin = () => {
    setUser({ id: '1', name: 'kiarash' })
    setTimeout(() => {
      nav(-1)
    }, 500);

  }

  const handleLogout = () => setUser(null)

  
  
  
  return (
    <>


      {user ? (
        <button onClick={handleLogout}>Sign Out</button>
      ) : (
        <button onClick={handleLogin}>Sign In</button>
      )}

      <div style={{
        margin: "3rem",
        padding: '2rem',
        display: 'flex',
        flexDirection:'column'
      }}>
        <CustomLi to={'/'}>home</CustomLi>
        <CustomLi to={'/dashboard'}>dashboard</CustomLi>
        <Link to={'/about/1'}>about</Link>
        <Link to={'/topics'}>topics</Link>
        <Link to={'/search'}>search</Link>
        <Link to={`/${url}`}>Invoices</Link>
      </div>

      <Routes>
        <Route exact path='/' element={<Home />} />
        <Route path='/about/:id' element={<About />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute user={user}>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path='/search/*' element={<SearchView/>}/>
        <Route path={`/${url}/*`} element={<Invoices users={users} />} />
        
        {/* error 404  */}
        <Route path={`*`} element={<NotFound />} />
      </Routes>


    </>
  );
}

function NotFound () {
  return(
    <>
        <h1 style={{
          display: 'flex',
          justifyContent: 'center',
          textAlign:'center',
          padding:'2rem'
        }}>not found 404</h1>   
    </>
  )
}

export default App;
