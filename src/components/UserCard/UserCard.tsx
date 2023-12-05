import { User } from '@/types'
import s from './UserCard.module.scss'

export default function UserCard(
    {value}: {value: User}
    ) {
    return (
      <div className={s.card__cardContent}>
        <h2>Notandanafn: {value.username}</h2>
        <h3>Nafn: {value.name}</h3>
        <p>Kláraðar setningar: {value.completedsentences}</p>
        <p>Kláraðar yfirferðir: {value.completedverifications}</p>
        <p>Notandi búinn til þann: {value.created}</p>
      </div>
    )
}