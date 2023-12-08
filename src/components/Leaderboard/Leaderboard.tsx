/* eslint-disable no-plusplus */
import { User, Users } from '@/types';
import s from './Leaderboard.module.scss';

export default function Leaderboard(
    {users}: {users: Users}
    ) {
    let position = 1;
    return (

      <table className={s.table}>
        <thead>
          <tr>
            <th>#</th>
            <th>Nafn</th>
            <th>Setningar</th>
            <th>Yfirferðir</th>
          </tr>
        </thead>
        <tbody>
          {users.users.map((value: User) => (
            !value.admin ? (
              <tr key={value.id}>
                <td>{position++}</td>
                <td>{value.name}</td>
                <td>{value.completedsentences}</td>
                <td>{value.completedverifications}</td>
              </tr>
            ) : (<></>)    
          ))}
        </tbody>
      </table>

    )
}