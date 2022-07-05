
import {createParamDecorator,ExecutionContext} from '@nestjs/common'
import { verifyToken } from 'src/auth/utils/secureUtils';
import { User as UserModel } from './../entities/user.entity';
export const User = createParamDecorator(async(data:unknown,ctx: ExecutionContext)=>{

  const request = ctx.switchToHttp().getRequest();
  let accessToken = null;
  try{
    accessToken = request.headers.authorization.split(" ")[1];
    const { id } = await verifyToken(accessToken) as {id:number};
    const user = await UserModel.findOne({where:{id:id}});
    return {
      name:user.name,
      email: user.email,
      role:user.role,
      avatar: user.avatar,
      score: user.score,
      subscriptionType: user.subscriptionType,
    }
  }catch(err){
    console.log(err);
    return null;
  }
})