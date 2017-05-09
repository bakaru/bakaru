import Inferno from 'inferno'

export default function Item(props) {
  let episodesWatched = 0;
  const episodesTotal = props.item.episodes.size;

  for (const episode of props.item.episodes.values()) {
    if (episode.watched) {
      episodesWatched++;
    }
  }

  return (
    <div className="library-item">
      <div className="title">
        {props.item.title}
      </div>
      <div className="details">
        <div className="detail">
          {props.item.width}&times;{props.item.height}
        </div>
      </div>
      <div className="counter">
        {episodesWatched}/{props.item.episodes.size}
      </div>
      <Progress width={100 * (episodesWatched / episodesTotal)}/>
    </div>
  );
}

function Progress({ width }) {
  return (
    <div className="progress" style={{ width: `calc(${width}% + 6px)` }}/>
  );
}
