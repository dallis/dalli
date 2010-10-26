class AddArtukylToProduct < ActiveRecord::Migration
  def self.up
    add_column :products, :artukyl, :string
  end

  def self.down
    remove_column :products, :artukyl
  end
end
