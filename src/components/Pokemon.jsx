import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Pokemon.css';

function Pokemon() {
  const [pokemonList, setPokemonList] = useState([]);
  const [selectedPokemon, setSelectedPokemon] = useState('');
  const [pokemonInfo, setPokemonInfo] = useState(null);

  useEffect(() => {
    const fetchPokemonList = async () => {
      try {
        const response = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=100');
        setPokemonList(response.data.results);
      } catch (error) {
        console.error('Error fetching Pokemon list:', error);
      }
    };

    fetchPokemonList();
  }, []);

  const fetchPokemonInfo = async (pokemonName) => {
    try {
      const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
      const speciesResponse = await axios.get(response.data.species.url);
      const evolutionResponse = await axios.get(speciesResponse.data.evolution_chain.url);

      const pokemonInfo = {
        name: response.data.name,
        sprite: response.data.sprites.front_default,
        type: response.data.types.map((type) => type.type.name).join(', '),
        height: response.data.height * 10, // Convertir decímetros a centímetros
        weight: response.data.weight / 10, // Convertir hectogramos a kilogramos
        abilities: response.data.abilities.map((ability) => ability.ability.name).join(', '),
        evolutions: extractEvolutions(evolutionResponse.data.chain),
      };

      setPokemonInfo(pokemonInfo);
    } catch (error) {
      console.error(`Error fetching Pokemon "${pokemonName}":`, error);
      setPokemonInfo(null);
    }
  };

  const extractEvolutions = (evolutionChain) => {
    const evolutions = [];

    const processEvolution = (evolution) => {
      evolutions.push(evolution.species.name);

      if (evolution.evolves_to.length > 0) {
        processEvolution(evolution.evolves_to[0]);
      }
    };

    processEvolution(evolutionChain);

    return evolutions;
  };

  const handlePokemonSelect = (event) => {
    const pokemonName = event.target.value;
    fetchPokemonInfo(pokemonName);
  };

  return (
    <div className="pokemon-container">
      <h1>Selecciona un Pokémon</h1>
      <select onChange={handlePokemonSelect}>
        <option value="">Seleccione un Pokémon</option>
        {pokemonList.map((pokemon) => (
          <option key={pokemon.name} value={pokemon.name}>
            {pokemon.name}
          </option>
        ))}
      </select>
      {pokemonInfo && (
        <div className="pokemon-details">
          <h2>{pokemonInfo.name}</h2>
          <img src={pokemonInfo.sprite} alt={pokemonInfo.name} />
          <div>
            <strong>Tipo:</strong> {pokemonInfo.type}
          </div>
          <div>
            <strong>Altura:</strong> {pokemonInfo.height} centímetros
          </div>
          <div>
            <strong>Peso:</strong> {pokemonInfo.weight} kilogramos
          </div>
          <div>
            <strong>Habilidades:</strong> {pokemonInfo.abilities}
          </div>
          {pokemonInfo.evolutions && (
            <div>
              <strong>Evoluciones:</strong> {pokemonInfo.evolutions.join(', ')}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Pokemon;
