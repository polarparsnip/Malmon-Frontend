import { Users } from '@/types'
import s from './Leaderboard.module.scss'

export default function Leaderboard(
    {users}: {users: Users}
    ) {
    return (

      <table className={s.table}>
        <thead>
          <tr>
            <th>Position</th>
            <th>Name</th>
            <th>Sentences</th>
            <th>Verifications</th>
          </tr>
        </thead>
        <tbody>
          {users.users.map((value: any, index: any) => (
            <tr key={value.id}>
              <td>{index + 1}</td>
              <td>{value.name}</td>
              <td>{value.completedsentences}</td>
              <td>{value.completedverifications}</td>
            </tr>
          ))}
        </tbody>
      </table>

    )
}