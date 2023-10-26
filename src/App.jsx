import { useState, useEffect } from 'react';
import './App.css'


function App() {
  const [categoryOptions, setCategoryOptions] = useState([])
  const [quizStarted, setQuizStarted] = useState(false);
	const [quizOptions, setQuizOptions] = useState(
		{
			category: "",
			difficulty: "",
			type: ""
		}
	);

	function handleQuizStart() {setQuizStarted(prevState => !prevState)};

	
	function handleChange(event){
		const { name, value } = event.target;

		setQuizOptions(prevGameOptions => {
			return {
				...prevGameOptions,
				[name]: value
			}
		});
	}
  
  useEffect(() => {
    const apiUrl = 'https://opentdb.com/api_category.php';

    fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
        const categoriesArray = data.trivia_categories;
        const options = categoriesArray.map(category => ({
          value: category.id,
          label: category.name,
        }));
        options.unshift({ value: '', label: 'N\'importe quelle catégorie' });
        setCategoryOptions(options);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);


  return (
    <main>
        {
          quizStarted
          ?
            console.log("game started ")
          :
            <section className="game-intro">
              <h1 className="game-title">Quiz game</h1>
              <p className="game-text">Répondez au questions et testez vos connaissances</p>

              <div className="quizOptions-container">
                <div className="select-container">
                  <label className="custom-label" htmlFor="category">Categorie:</label>

                  <select
                    name="category"
                    id="category"
                    className="custom-select"
                    value={quizOptions.category}
                    onChange={handleChange}
                  >
                    {categoryOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="select-container">
                  <label className="custom-label" htmlFor="difficulty">Difficulté:</label>

                  <select
                    name="difficulty"
                    id="difficulty"
                    className="custom-select"
                    value={quizOptions.difficulty}
                    onChange={handleChange}
                  >
                    <option value="">Toute difficulté</option>
                    <option value="easy">Facile</option>
                    <option value="medium">Moyen</option>
                    <option value="hard">Difficile</option>
                  </select>
                </div>
                
                <div className="select-container">
                  <label className="custom-label" htmlFor="type">Type de questions:</label>

                  <select
                    name="type"
                    id="type"
                    className="custom-select"
                    value={quizOptions.type}
                    onChange={handleChange}
                  >
                    <option value="">N'importe quel type</option>
                    <option value="multiple">Choix multiple</option>
                    <option value="boolean">Vrai / Faux</option>
                  </select>
                </div>
              </div>

              <button className="btn-primary" onClick={handleQuizStart}>Commencer</button>
            </section>
        }
    </main>
  )
}

export default App
