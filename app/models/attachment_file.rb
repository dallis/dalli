class AttachmentFile < Asset
  has_attached_file :data
  validates_attachment_size :data, :less_than=>10.megabytes
end
