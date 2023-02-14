const App = {
  data: () => ({}),
  template: `<div class="navbar">
      <nav class="nav">
        <div class="nav-el" id="name_project">
          <router-link to="/">OBP</router-link>
        </div>
         <div class="nav-el">
          <router-link to="/layout">Layout</router-link>
        </div>
      </nav>
    </div>
    <router-view></router-view>`,
};

export default App;
