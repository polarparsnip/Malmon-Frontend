import { Sentence } from '@/types'
import s from './SentenceCard.module.scss'

export default function SentenceCard(
    {value}: {value: Sentence}
    ) {
    return (
      <div className={s.card__cardContent}>
        <h2>{value.sentence}</h2>
        {value.simplified? (<p>Hefur verið einfölduð</p>) : (<p>Hefur ekki verið einfölduð</p>)}
      </div>
    )
}