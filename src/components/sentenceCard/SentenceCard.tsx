import s from './SentenceCard.module.scss';

export default function SentenceCard(
  {value}: {value: String}
  ) {

  return (
    <div className={s.card}>
      <div className={s.card__cardContent}>
        <p>{value}</p>
      </div>
    </div>
  )
}