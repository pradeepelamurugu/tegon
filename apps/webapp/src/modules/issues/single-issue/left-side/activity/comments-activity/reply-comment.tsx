import { useCreateIssueCommentMutation } from 'services/issues';
import { AvatarText } from '@tegonhq/ui/components/avatar';
import { Button } from '@tegonhq/ui/components/button';
import {
  Editor,
  EditorExtensions,
  suggestionItems,
} from '@tegonhq/ui/components/editor/index';
import { SendLine } from '@tegonhq/ui/icons';
import * as React from 'react';

import { useIssueData } from 'hooks/issues';

import { UserContext } from 'store/user-context';

interface ReplyCommentProps {
  issueCommentId: string;
  badgeContent?: React.ReactNode;
}

export function ReplyComment({
  issueCommentId,
  badgeContent,
}: ReplyCommentProps) {
  const currentUser = React.useContext(UserContext);
  const issueData = useIssueData();
  const [commentValue, setCommentValue] = React.useState('');
  const { mutate: createIssueComment } = useCreateIssueCommentMutation({});
  const [showReplyButton, setShowReplyButton] = React.useState(false);

  const onSubmit = () => {
    createIssueComment({
      body: commentValue,
      issueId: issueData.id,
      parentId: issueCommentId,
    });
    setCommentValue('');
  };

  return (
    <div className="flex items-start w-full border-t px-3 py-2 pb-0">
      <AvatarText text={currentUser.fullname} className="text-[9px]" />

      <div className="w-full relative">
        <Editor
          placeholder="Leave a reply..."
          value={commentValue}
          onFocus={() => {
            setShowReplyButton(true);
          }}
          onSubmit={onSubmit}
          onBlur={() => {
            !commentValue && setShowReplyButton(false);
          }}
          onChange={(e) => setCommentValue(e)}
          className="w-full bg-transparent px-3 py-2 pt-0"
        >
          <EditorExtensions suggestionItems={suggestionItems} />
        </Editor>
        <div className="flex justify-between items-center">
          {showReplyButton && (
            <>
              <div>{badgeContent}</div>
              <Button
                variant="ghost"
                className="my-2 transition-all duration-500 ease-in-out"
                type="submit"
                onClick={onSubmit}
              >
                <SendLine size={20} />
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
