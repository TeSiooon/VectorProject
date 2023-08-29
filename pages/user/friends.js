import { Col, Row } from "react-bootstrap";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]";
import FriendRequests from "../../components/FriendRequests";
import FriendsList from "../../components/FriendList";
import client from "../../lib/prismadb";

const Friends = ({ friendRequests }) => {
  return (
    <Row className="mt-5">
      <Col>
        <FriendRequests requestData={friendRequests} />
      </Col>
      <Col>
        <FriendsList />
      </Col>
    </Row>
  );
};

export default Friends;
export const getServerSideProps = async (context) => {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );

  if (!session) {
    return {
      redirect: {
        destination: "/auth/credentials-signin",
        permanent: false,
      },
    };
  }
  const userId = session?.user?.id;

  const friendRequests = await client.friendRequest.findMany({
    where: {
      toUserId: parseInt(userId),
      status: "oczekujace",
    },
    include: {
      fromUser: {
        select: {
          firstName: true,
          lastName: true,
          images: {
            select: {
              imgURL: true,
            },
            where: {
              isAvatar: true,
            },
            take: 1,
          },
        },
      },
    },
  });

  return {
    props: { friendRequests },
  };
};
