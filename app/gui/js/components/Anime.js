import React, { Component } from 'react';

/**
 * @param {AnimeFolder} folder
 * @returns {XML}
 * @constructor
 */
export default function Anime ({ folder }) {
  const episodes = renderEps(folder.episodes);
  const dubs = renderDubs(folder.dubs);
  const subs = renderSubs(folder.subs);

  return (
    <anime>
      <summary>
        <title>{ folder.name }</title>
        <path>{ folder.path }</path>
      </summary>
      <backery>
        <selectors>
          <list>
            <subtitle>Dubs</subtitle>
            { dubs.length > 0 ? dubs : (<option>No dubs</option>) }
          </list>
          <list>
            <subtitle>Subs</subtitle>
            { subs.length > 0 ? subs : (<option>No subs</option>) }
          </list>
        </selectors>
        <subtitle>Episodes</subtitle>
        <episodes>
          { episodes }
        </episodes>
        <subtitle>Settings</subtitle>
        <settings>
          Settings here
        </settings>
        <actions>
          <button>Bake</button>
          <button>Run MPC-HC</button>
        </actions>
      </backery>
    </anime>
  );
}

function option(id, name, selected = false) {
  return (
    <option value={ id } key={ id } className={ selected ? 'selected' : '' }>
      <i className="fa fa-check-square-o"></i>
      { name }
    </option>
  );
}

function renderSubs(subs) {
  return subs.map(sub => option(sub.id, sub.name));
}

function renderDubs(dubs) {
  return dubs.map(dub => option(dub.id, dub.name));
}

function renderEps(eps) {
  return eps.map(episode => {
    console.log(episode.mediainfo);

    return (
      <episode key={ episode.id }>
        { episode.name }
      </episode>
    );
  });
}